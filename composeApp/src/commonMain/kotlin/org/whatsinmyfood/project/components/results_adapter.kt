/*import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class ResultsAdapter(private val categorizedResults: Map<String, List<String>>) :
    RecyclerView.Adapter<ResultsAdapter.ViewHolder>() {

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val keywordTextView: TextView = itemView.findViewById(R.id.keywordTextView)
        val resultsTextView: TextView = itemView.findViewById(R.id.resultsTextView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_result, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val keyword = categorizedResults.keys.elementAt(position)
        val matchingElements = categorizedResults[keyword]?.joinToString(", ") ?: ""

        holder.keywordTextView.text = keyword.replace("-", " ").uppercase()
        holder.resultsTextView.text = matchingElements.replace("-", " ")
    }

    override fun getItemCount(): Int {
        return categorizedResults.size
    }
}
 */