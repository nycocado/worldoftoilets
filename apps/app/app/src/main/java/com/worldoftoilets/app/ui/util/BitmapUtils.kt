package com.worldoftoilets.app.ui.util

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter

fun tintBitmap(bitmap: Bitmap, color: Int): Bitmap {
    val paint = Paint().apply {
        colorFilter = PorterDuffColorFilter(color, PorterDuff.Mode.SRC_IN)
    }
    val resultBitmap = Bitmap.createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(resultBitmap)
    canvas.drawBitmap(bitmap, 0f, 0f, paint)
    return resultBitmap
}