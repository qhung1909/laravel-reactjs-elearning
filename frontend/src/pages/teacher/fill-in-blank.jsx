const handleDragDrop = (droppedWord) => {
    setQuestion(prev => prev + ` ${droppedWord}`);
  };

  return (
    <div>
      <textarea value={question} onChange={handleInputChange} />
      <div className="word-list">
        {["react", "component", "state"].map(word => (
          <span key={word} onClick={() => handleDragDrop(word)}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
