/*import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.FragmentActivity
import kotlin.Exception

class ScanButtonActivity : AppCompatActivity() {

    private var barCodeScanResult: String = ""
    private val foundThings: MutableList<String> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scan_button)

        val scanButton = findViewById<Button>(R.id.scan_button)

        scanButton.setOnClickListener {
            if (GlobalVariables.lookingForThings.isEmpty()) {
                showAlert(this, "Nothing Selected", "You need to select something to filter for")
                return@setOnClickListener
            }

            showProcessingDialog(this, "Scanning your item...")
            Log.d("ScanButtonActivity", "Scanning dialog shown")

            try {
                barcodeScannerLauncher.launch(Intent(this, SimpleBarcodeScannerActivity::class.java))
            } catch (e: Exception) {
                Log.e("ScanButtonActivity", "Error occurred: $e")
                showAlert(this, "Error", "An error occurred while processing your request. Please try again.")
            }
        }
    }

    // ActivityResultLauncher for handling barcode scanning result
    private val barcodeScannerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK) {
            val res = result.data?.getStringExtra("SCAN_RESULT") // Replace with actual key if needed
            res?.let {
                barCodeScanResult = it
                makeGetRequest(barCodeScanResult, foundThings, this)
            } ?: run {
                showAlert(this, "Error", "Barcode scanning failed or was cancelled")
            }
        } else {
            showAlert(this, "Error", "Barcode scanning failed or was cancelled")
        }
    }

    private fun showAlert(context: Context, title: String, message: String) {
        AlertDialog.Builder(context)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .create()
            .show()
    }

    private fun showProcessingDialog(context: Context, message: String) {
        AlertDialog.Builder(context)
            .setMessage(message)
            .setCancelable(false)
            .create()
            .show()
    }
}
*/