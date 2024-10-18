/*import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_toggle.view.*

class ToggleAdapter(
    private val items: Map<String, List<String>>,
    private val states: MutableMap<String, Boolean>,
    private val onCheckedChange: (String, Boolean) -> Unit
) : RecyclerView.Adapter<ToggleAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_toggle, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val category = items.keys.elementAt(position)
        holder.bind(category, items[category] ?: listOf())
    }

    override fun getItemCount(): Int = items.size

    inner class ViewHolder(itemView: android.view.View) : RecyclerView.ViewHolder(itemView) {
        fun bind(category: String, toggles: List<String>) {
            itemView.categoryTitle.text = category
            itemView.toggleSwitch.isChecked = states[category] ?: false
            itemView.toggleSwitch.setOnCheckedChangeListener { _, isChecked ->
                onCheckedChange(category, isChecked)
            }
        }
    }
}
 */