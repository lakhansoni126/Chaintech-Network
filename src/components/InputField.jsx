const InputField = ({ id, label, type = 'text', placeholder, value, onChange }) => (
    <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder={placeholder}
        />
    </div>
);

export default InputField;
