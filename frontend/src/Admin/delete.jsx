<td className="py-2 px-4 border-b">
{university.image ? (
    <div>
    {console.log('Image URL:', university.image)} {/* Log the image URL */}
    <img
        src={`{baseurl}${university.image}`}
        alt={university.name}
        className="w-16 h-16 object-cover rounded"
    />
    </div>
) : (
    "No Image"
)}
</td>


