package org.whatsinmyfood.project

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "whats-in-my-food",
    ) {
        App()
    }
}