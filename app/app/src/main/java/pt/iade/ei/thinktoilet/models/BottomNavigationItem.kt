package pt.iade.ei.thinktoilet.models

import androidx.compose.ui.graphics.vector.ImageVector

data class BottomNavigationItem(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val hasNews: Boolean,           // Notificaçoes bolinha vermelha
    val badgeCount: Int? = null,     // Notificaçaoes mas em numeros
    val router: String,
)
