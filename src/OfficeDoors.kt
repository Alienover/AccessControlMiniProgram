package com.jiarong.office

import android.app.PendingIntent
import android.content.Intent
import android.service.controls.Control
import android.service.controls.ControlsProviderService
import android.service.controls.DeviceTypes
import android.service.controls.actions.BooleanAction
import android.service.controls.actions.ControlAction
import android.service.controls.templates.ControlButton
import android.service.controls.templates.ToggleTemplate
import android.util.Log
import androidx.annotation.RequiresApi
import kotlinx.coroutines.*
import okhttp3.*
import okio.IOException
import org.reactivestreams.FlowAdapters
import org.reactivestreams.Subscription
import reactor.core.publisher.ReplayProcessor
import java.util.concurrent.Flow
import java.util.function.Consumer

/**
 * Thanks Kieron Quinn
 * Refer from:
 *  - https://gist.github.com/KieronQuinn/c9950f3ee09e11f305ce16e7f48f03b8
 *  - https://developer.android.com/preview/features/device-control#kotlin
 */

@RequiresApi(30)
class OfficeDoor : ControlsProviderService() {

    private val doorService = DoorService()
    private lateinit var updatePublisher: ReplayProcessor<Control>

    private val uncheckButtonTemplate = ToggleTemplate("uncheck", ControlButton(false, "uncheck"))
    private val checkedButtonTemplate = ToggleTemplate("checked", ControlButton(true, "checked"))

    private val deviceMap: Map<String, Control>
        get() {
            val pi = PendingIntent.getService(baseContext, 0, Intent(), PendingIntent.FLAG_UPDATE_CURRENT)
            return doorService.doors.map { it.id to Control.StatelessBuilder(
                it.id,
                pi
            )
                .setTitle(it.name)
                .setSubtitle(it.group)
                .setDeviceType(DeviceTypes.TYPE_DOOR).build()
            }.toMap()
        }

    private fun getSelectedControl(control: Control): Control {
        Log.d("ControlTest", "Get selected control: ${control.controlId}")
        return Control.StatefulBuilder(control)
            .setStatusText(control.title)
            .setTitle(control.subtitle)
            .setSubtitle("Tap to open")
            .setDeviceType(DeviceTypes.TYPE_DOOR)
            .setStatus(Control.STATUS_OK)
            .setControlTemplate(this.uncheckButtonTemplate)
            .build()
    }

    private fun getRequestControl(control: Control): Control {
        Log.d("ControlTest", "Get request control: ${control.controlId}")
        return Control.StatefulBuilder(control)
            .setStatusText("Opening...")
            .setStatus(Control.STATUS_OK)
            .setControlTemplate(this.checkedButtonTemplate)
            .build()
    }

    private fun getSuccessControl(control: Control): Control {
        Log.d("ControlTest", "Get success control: ${control.controlId}")
        return Control.StatefulBuilder(control)
            .setStatusText("Opened!")
            .setStatus(Control.STATUS_OK)
            .setControlTemplate(this.checkedButtonTemplate)
            .build()
    }

    private fun getFailedControl(control: Control): Control {
        Log.d("ControlTest", "Get failed control: ${control.controlId}")
        return Control.StatefulBuilder(control)
            .setStatusText("Failed!")
            .setStatus(Control.STATUS_OK)
            .setControlTemplate(this.checkedButtonTemplate)
            .build()
    }

    override fun createPublisherForAllAvailable(): Flow.Publisher<Control> {
        return Flow.Publisher {
            for (control in deviceMap.values) {
                it.onNext(control)
            }
            it.onComplete()
        }
    }

    override fun createPublisherFor(controlIds: MutableList<String>): Flow.Publisher<Control> {
        Log.d("ControlTest", "publisherFor $controlIds")
        updatePublisher = ReplayProcessor.create()
        for (controlId in controlIds) {
            val control = deviceMap[controlId] ?: continue

            Log.d("ControlTest", "Found ${control.controlId}")
            updatePublisher.onSubscribe(object: Subscription {
                override fun cancel() {
                    Log.d("ControlTest", "cancel")
                }

                override fun request(p0: Long) {
                    Log.d("ControlTest", "request $p0")
                }
            })

            updatePublisher.onNext(getSelectedControl(control))
        }
        return FlowAdapters.toFlowPublisher(updatePublisher)
    }

    override fun performControlAction(
        controlId: String,
        action: ControlAction,
        consumer: Consumer<Int>
    ) {
        if (action is BooleanAction) {
            // Inform SystemUI that the action has been received and is being processed
            consumer.accept(ControlAction.RESPONSE_OK)

            openDoor(controlId)
        }

        Log.d(
            "ControlTest",
            "performControlAction $controlId $action $consumer"
        )
    }

    private fun resetControl(control: Control) {
        runBlocking {
            delay(1000)
            updatePublisher.onNext(getSelectedControl(control))
        }
    }

    private fun openDoor(controlId: String) {
        val control = deviceMap[controlId] ?: return

        updatePublisher.onNext(getRequestControl(control))
        try {
            doorService.unlock(controlId, object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    updatePublisher.onNext(getFailedControl(control))
                    resetControl(control)

                    e.printStackTrace()
                }

                override fun onResponse(call: Call, response: Response) {
                    response.use {
                        if (!response.isSuccessful) throw IOException("Unexpected code $response")

                        for ((name, value) in response.headers) {
                            println("$name: $value")
                        }

                        updatePublisher.onNext(getSuccessControl(control))
                        resetControl(control)

                        Log.d("ControlTest", "Response: ${response.body!!.string()}")
                    }
                }
            })
        } catch(e: IOException) {
            Log.d("ControlTest", e.toString())
        }
    }
}