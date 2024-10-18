/*
import android.Manifest
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.PermissionChecker.PERMISSION_GRANTED

class RequestPermissionsActivity : AppCompatActivity() {

    private val permissions = arrayOf(
        Manifest.permission.CAMERA,
        Manifest.permission.READ_EXTERNAL_STORAGE,
        Manifest.permission.WRITE_EXTERNAL_STORAGE,
        Manifest.permission.ACCESS_MEDIA_LOCATION
    )

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        // Handle the permission statuses
        when {
            permissions[Manifest.permission.CAMERA] == true -> {
                Toast.makeText(this, "Camera permission granted", Toast.LENGTH_SHORT).show()
            }
            permissions[Manifest.permission.CAMERA] == false -> {
                if (ActivityCompat.shouldShowRequestPermissionRationale(
                        this, Manifest.permission.CAMERA
                    )
                ) {
                    Toast.makeText(this, "Camera permission denied", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "Camera permission permanently denied, please enable it from settings", Toast.LENGTH_SHORT).show()
                    openAppSettings()
                }
            }

            permissions[Manifest.permission.READ_EXTERNAL_STORAGE] == true &&
                permissions[Manifest.permission.WRITE_EXTERNAL_STORAGE] == true -> {
                Toast.makeText(this, "Storage permission granted", Toast.LENGTH_SHORT).show()
            }

            permissions[Manifest.permission.READ_EXTERNAL_STORAGE] == false ||
                permissions[Manifest.permission.WRITE_EXTERNAL_STORAGE] == false -> {
                Toast.makeText(this, "Storage permission denied", Toast.LENGTH_SHORT).show()
            }

            permissions[Manifest.permission.ACCESS_MEDIA_LOCATION] == true -> {
                Toast.makeText(this, "Media location permission granted", Toast.LENGTH_SHORT).show()
            }

            permissions[Manifest.permission.ACCESS_MEDIA_LOCATION] == false -> {
                Toast.makeText(this, "Media location permission denied", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_request_permissions)

        val requestButton: Button = findViewById(R.id.requestPermissionsButton)
        requestButton.setOnClickListener {
            requestPermissions()
        }
    }

    private fun requestPermissions() {
        // Check if permissions are already granted
        if (permissions.all {
                ContextCompat.checkSelfPermission(this, it) == PERMISSION_GRANTED
            }) {
            Toast.makeText(this, "All permissions already granted", Toast.LENGTH_SHORT).show()
        } else {
            // Request multiple permissions
            requestPermissionLauncher.launch(permissions)
        }
    }

    private fun openAppSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        intent.data = android.net.Uri.fromParts("package", packageName, null)
        startActivity(intent)
    }
}

*/