package com.jiarong.office

import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody

data class Door(val id: String, val name: String, val group: String)

class DoorService {
    companion object {
        private const val GROUP_DATA_TEAM = "Data Team"
        private const val GROUP_DEV_TEAM = "Dev Team"

        private val DOOR_3F_GATE = Door("105010118010023", "3F Gate", "")
        private val DOOR_3F13 = Door("100100118010232","3F 13", GROUP_DATA_TEAM)
        private val DOOR_3F13A = Door("100100118010182", "3F 13A", GROUP_DATA_TEAM)
        private val DOOR_4F13A = Door("105010118010007", "4F 13A", GROUP_DEV_TEAM)
        private val DOOR_4F15 = Door("100100118010038", "4F 15", GROUP_DEV_TEAM)
        private val DOOR_4F16 = Door("100100118010189", "4F 16", GROUP_DEV_TEAM)

        private const val UNLOCK_TYPE = "1"
        private const val API_VERSION = "7.0.0"
        private const val USER_ID = "156758972941a61bba9d6e334604a016"
        private const val UNLOCK_URL = "http://mwsq.scities.cc:8080/mobileInterface/sip/unlock/onlineUnLock"
    }

    private val client = OkHttpClient()
    val doors = arrayOf(
        DOOR_3F_GATE,
        DOOR_3F13,
        DOOR_3F13A,
        DOOR_4F13A,
        DOOR_4F15,
        DOOR_4F16
    )

    private fun post(url: String, body: RequestBody, callback: Callback) {
        val request = Request.Builder().url(url).post(body).build()

        val call = client.newCall(request)
        call.enqueue(callback)
    }

    private fun getDoorData(doorId: String): RequestBody {
        return """
            {
                "apiVersion": "$API_VERSION",
                "userId":"$USER_ID",
                "unlockType": $UNLOCK_TYPE,
                "terminalSerial":"$doorId"
            }
        """.trimIndent().toRequestBody("text/plain".toMediaType())
    }

    fun unlock(doorId: String, callback: Callback) {
        val data = this.getDoorData(doorId)

        this.post(UNLOCK_URL, data, callback)
    }
}