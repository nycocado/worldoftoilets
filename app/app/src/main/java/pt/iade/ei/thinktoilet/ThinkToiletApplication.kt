package pt.iade.ei.thinktoilet

import android.app.Application
import android.os.Bundle
import android.preference.PreferenceManager
import dagger.hilt.android.HiltAndroidApp
import org.osmdroid.config.Configuration

@HiltAndroidApp
class ThinkToiletApplication: Application(){
    override fun onCreate() {
        super.onCreate()
        Configuration.getInstance().load(this, getSharedPreferences("OSM", MODE_PRIVATE))
    }
}