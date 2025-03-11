function AddTask({ onTaskAdded }) {
    const [content, setContent] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await axios.post("http://localhost:5000/api/tasks", { content });
      onTaskAdded(res.data);
      setContent("");
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New Task"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    );
  }