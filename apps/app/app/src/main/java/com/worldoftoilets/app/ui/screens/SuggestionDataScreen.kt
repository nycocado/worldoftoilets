package com.worldoftoilets.app.ui.screens

import android.location.Location
import android.net.Uri
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.rounded.AddPhotoAlternate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import coil3.request.ImageRequest
import coil3.request.crossfade
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.enums.TypeAccess
import com.worldoftoilets.app.models.enums.TypeExtra
import com.worldoftoilets.app.ui.components.LocationPickerMap
import com.worldoftoilets.app.ui.components.NextTextField
import com.worldoftoilets.app.ui.components.SanitaryButton
import com.worldoftoilets.app.ui.theme.AppTheme

enum class SuggestionStep {
    DATA,
    EXTRAS,
    LOCATION,
    IMAGE
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun SuggestionDataScreen(
    initialLocation: Location? = null,
    navigateToBack: () -> Unit = {},
    onSubmit: (String, String, String, String, String, String, List<String>, Double, Double, Uri?) -> Unit = { _, _, _, _, _, _, _, _, _, _ -> },
    error: String? = null,
    onErrorShown: () -> Unit = {}
) {
    val context = LocalContext.current
    var currentStep by remember { mutableStateOf(SuggestionStep.DATA) }
    val snackbarHostState = remember { SnackbarHostState() }

    var latitude by remember { mutableDoubleStateOf(initialLocation?.latitude ?: 0.0) }
    var longitude by remember { mutableDoubleStateOf(initialLocation?.longitude ?: 0.0) }

    var name by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var state by remember { mutableStateOf("") }
    var country by remember { mutableStateOf("") }
    var access by remember { mutableStateOf<TypeAccess?>(null) }
    var extras by remember { mutableStateOf<Set<TypeExtra>>(emptySet()) }
    var imageUri by remember { mutableStateOf<Uri?>(null) }

    val pickMedia = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) {
            imageUri = uri
        }
    }

    val isLocationValid = latitude != 0.0 && longitude != 0.0
    val isDataValid = name.isNotEmpty() && address.isNotEmpty() && city.isNotEmpty() && state.isNotEmpty() && country.isNotEmpty()
    val isExtrasValid = access != null

    LaunchedEffect(error) {
        if (!error.isNullOrEmpty()) {
            currentStep = SuggestionStep.DATA
            snackbarHostState.showSnackbar(error)
            onErrorShown()
        }
    }

    BackHandler(enabled = currentStep != SuggestionStep.DATA) {
        currentStep = when (currentStep) {
            SuggestionStep.IMAGE -> SuggestionStep.LOCATION
            SuggestionStep.LOCATION -> SuggestionStep.EXTRAS
            SuggestionStep.EXTRAS -> SuggestionStep.DATA
            else -> SuggestionStep.DATA
        }
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.suggest_toilet_title),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(
                        onClick = {
                            when (currentStep) {
                                SuggestionStep.IMAGE -> currentStep = SuggestionStep.LOCATION
                                SuggestionStep.LOCATION -> currentStep = SuggestionStep.EXTRAS
                                SuggestionStep.EXTRAS -> currentStep = SuggestionStep.DATA
                                SuggestionStep.DATA -> navigateToBack()
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = context.getString(R.string.back)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 32.dp)
            ) {
                SanitaryButton(
                    text = if (currentStep == SuggestionStep.IMAGE) context.getString(R.string.suggest_toilet) else context.getString(R.string.start_suggestion), // Reusing "Start" as "Next"
                    onClick = {
                        when (currentStep) {
                            SuggestionStep.DATA -> currentStep = SuggestionStep.EXTRAS
                            SuggestionStep.EXTRAS -> currentStep = SuggestionStep.LOCATION
                            SuggestionStep.LOCATION -> currentStep = SuggestionStep.IMAGE
                            SuggestionStep.IMAGE -> {
                                onSubmit(
                                    name,
                                    address,
                                    city,
                                    state,
                                    country,
                                    access!!.technicalValue,
                                    extras.map { it.technicalValue },
                                    latitude,
                                    longitude,
                                    imageUri
                                )
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = when (currentStep) {
                        SuggestionStep.LOCATION -> isLocationValid
                        SuggestionStep.DATA -> isDataValid
                        SuggestionStep.EXTRAS -> isExtrasValid
                        SuggestionStep.IMAGE -> true
                    }
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .then(
                    if (currentStep != SuggestionStep.LOCATION) {
                        Modifier
                            .padding(horizontal = 32.dp)
                            .verticalScroll(rememberScrollState())
                    } else Modifier
                ),
            verticalArrangement = if (currentStep == SuggestionStep.LOCATION) Arrangement.Top else Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            when {
                currentStep == SuggestionStep.DATA -> {
                    NextTextField(
                        label = context.getString(R.string.toilet_name),
                        value = name,
                        supportText = "",
                        onValueChange = { name = it }
                    )
                    NextTextField(
                        label = context.getString(R.string.address),
                        value = address,
                        supportText = "",
                        onValueChange = { address = it }
                    )
                    NextTextField(
                        label = context.getString(R.string.city),
                        value = city,
                        supportText = "",
                        onValueChange = { city = it }
                    )
                    NextTextField(
                        label = context.getString(R.string.state),
                        value = state,
                        supportText = "",
                        onValueChange = { state = it }
                    )
                    NextTextField(
                        label = context.getString(R.string.country),
                        value = country,
                        supportText = "",
                        onValueChange = { country = it }
                    )
                }
                currentStep == SuggestionStep.EXTRAS -> {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = stringResource(R.string.filter_access_type),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            TypeAccess.entries.forEach { typeAccess ->
                                FilterChip(
                                    selected = access == typeAccess,
                                    onClick = {
                                        access = if (access == typeAccess) null else typeAccess
                                    },
                                    label = { Text(stringResource(typeAccess.value)) },
                                    leadingIcon = if (access == typeAccess) {
                                        {
                                            Icon(
                                                imageVector = Icons.Filled.Check,
                                                contentDescription = null,
                                                modifier = Modifier.height(FilterChipDefaults.Height)
                                            )
                                        }
                                    } else null,
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer,
                                        selectedLeadingIconColor = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                )
                            }
                        }
                    }

                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = stringResource(R.string.filter_extras),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            TypeExtra.entries.forEach { extra ->
                                val isSelected = extras.contains(extra)
                                FilterChip(
                                    selected = isSelected,
                                    onClick = {
                                        extras = if (isSelected) {
                                            extras - extra
                                        } else {
                                            extras + extra
                                        }
                                    },
                                    label = { Text(stringResource(extra.value)) },
                                    leadingIcon = if (isSelected) {
                                        {
                                            Icon(
                                                imageVector = Icons.Filled.Check,
                                                contentDescription = null,
                                                modifier = Modifier.height(FilterChipDefaults.Height)
                                            )
                                        }
                                    } else null,
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer,
                                        selectedLeadingIconColor = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                )
                            }
                        }
                    }
                }
                currentStep == SuggestionStep.LOCATION -> {
                    LocationPickerMap(
                        initialLocation = initialLocation,
                        onLocationSelected = { lat, lng ->
                            latitude = lat
                            longitude = lng
                        }
                    )
                }
                currentStep == SuggestionStep.IMAGE -> {
                    Text(
                        text = stringResource(R.string.suggest_add_photo_title),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(300.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        if (imageUri != null) {
                            AsyncImage(
                                model = ImageRequest.Builder(LocalContext.current)
                                    .data(imageUri)
                                    .crossfade(true)
                                    .build(),
                                contentDescription = stringResource(R.string.content_description_toilet_image),
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Rounded.AddPhotoAlternate,
                                contentDescription = null,
                                modifier = Modifier.size(64.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (imageUri == null) {
                        Button(
                            onClick = {
                                pickMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(stringResource(R.string.suggest_pick_photo))
                        }
                    } else {
                        Button(
                            onClick = {
                                pickMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.secondaryContainer,
                                contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                            )
                        ) {
                            Text(stringResource(R.string.suggest_change_photo))
                        }
                        TextButton(
                            onClick = { imageUri = null },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(stringResource(R.string.delete_action)) // Reusing delete action string
                        }
                    }

                    Text(
                        text = stringResource(R.string.suggest_photo_optional),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
                currentStep != SuggestionStep.LOCATION -> {
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SuggestionDataScreenPreview() {
    AppTheme {
        SuggestionDataScreen()
    }
}