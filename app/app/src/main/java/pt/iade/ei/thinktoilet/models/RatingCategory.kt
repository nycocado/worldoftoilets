package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class RatingCategory(
    var clean: Float,
    var paper: Float,
    var structure: Float,
    var accessibility: Float
) : Serializable {
    fun average(): Float {
        return ((clean * 0.2f) + ((paper / 20) * 0.4f) + (structure * 0.2f) + accessibility * 0.2f)
    }
}
/*
Basicamente em fez de fazer uma média fizemos uma soma entre as variaveis e atribuimos um peso a cada uma delas
clean = 20%
paper = 40%
    dividimos por 20 para obter um valor entre 0 e 5 e depois multiplicamos por 40%
structure = 20%
accessibility = 20%
 */