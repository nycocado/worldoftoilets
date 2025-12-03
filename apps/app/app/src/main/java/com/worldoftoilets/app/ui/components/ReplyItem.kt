package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.Send
import androidx.compose.material.icons.rounded.Flag
import androidx.compose.material.icons.rounded.MoreVert
import androidx.compose.material.icons.rounded.Verified
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.Reply
import com.worldoftoilets.app.models.User

@Composable
fun ReplyItem(
    reply: Reply,
    userMain: User?,
    navigateToReport: (id: String) -> Unit = {},
    navigateToUserReport: (id: String) -> Unit = {},
    onEdit: (String) -> Unit = {},
    onDelete: () -> Unit = {}
) {
    val context = LocalContext.current
    var isEditing by remember { mutableStateOf(false) }
    var editText by remember { mutableStateOf(reply.text) }
    var showMenu by remember { mutableStateOf(false) }
    var showUserMenu by remember { mutableStateOf(false) }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box {
            Image(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .border(
                        width = 1.dp,
                        color = MaterialTheme.colorScheme.primary,
                        shape = CircleShape
                    )
                    .then(
                        if (userMain?.publicId != reply.user.publicId) {
                            Modifier.clickable { showUserMenu = true }
                        } else {
                            Modifier
                        }
                    ),
                painter = reply.user.getIcon(),
                contentDescription = context.getString(R.string.content_description_profile_picture)
            )

            if (userMain?.publicId != reply.user.publicId) {
                DropdownMenu(
                    expanded = showUserMenu,
                    onDismissRequest = { showUserMenu = false }
                ) {
                    DropdownMenuItem(
                        text = { Text(context.getString(R.string.report)) },
                        onClick = {
                            showUserMenu = false
                            navigateToUserReport(reply.user.publicId)
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Rounded.Flag,
                                contentDescription = context.getString(R.string.image_description_null),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    )
                }
            }
        }
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = reply.user.name,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            color = if (reply.user.isPartner) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                        )
                        if (reply.user.isPartner) {
                            Icon(
                                imageVector = Icons.Rounded.Verified,
                                contentDescription = context.getString(R.string.content_description_verified),
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                    Text(
                        text = reply.getDateTimeString(),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Actions Menu
                Box {
                    IconButton(
                        modifier = Modifier.size(20.dp),
                        onClick = { showMenu = true }
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.MoreVert,
                            contentDescription = context.getString(R.string.content_description_options_menu),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    DropdownMenu(
                        expanded = showMenu,
                        onDismissRequest = { showMenu = false }
                    ) {
                        if (userMain != null && userMain.publicId == reply.user.publicId) {
                            DropdownMenuItem(
                                text = { Text(context.getString(R.string.edit_action)) },
                                onClick = {
                                    isEditing = true
                                    showMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(context.getString(R.string.delete_action)) },
                                onClick = {
                                    onDelete()
                                    showMenu = false
                                }
                            )
                        } else {
                            DropdownMenuItem(
                                text = { Text(context.getString(R.string.report)) },
                                onClick = {
                                    navigateToReport(reply.publicId)
                                    showMenu = false
                                },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Rounded.Flag,
                                        contentDescription = context.getString(R.string.image_description_null),
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            )
                        }
                    }
                }
            }

            if (isEditing) {
                OutlinedTextField(
                    value = editText,
                    onValueChange = { editText = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = false,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = {
                        if (editText.isNotBlank()) {
                            onEdit(editText)
                            isEditing = false
                        }
                    }),
                    trailingIcon = {
                        IconButton(onClick = {
                            if (editText.isNotBlank()) {
                                onEdit(editText)
                                isEditing = false
                            }
                        }) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Rounded.Send,
                                contentDescription = context.getString(R.string.content_description_save_button)
                            )
                        }
                    }
                )
            } else {
                Text(
                    text = reply.text,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}
