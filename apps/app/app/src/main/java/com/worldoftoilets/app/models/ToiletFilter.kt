package com.worldoftoilets.app.models

import com.worldoftoilets.app.models.enums.TypeAccess
import com.worldoftoilets.app.models.enums.TypeExtra

data class ToiletFilter(
    val access: TypeAccess? = null,
    val extras: Set<TypeExtra> = emptySet()
)
