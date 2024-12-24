import React, { useState } from 'react';

const WordSelection = ({ onAddLink }) => {
  const [word, setWord] = useState(''); // For typing the word to be linked
  const [url, setUrl] = useState('');   // For the link URL

  const handleAddLink = () => {
    if (word && url) {
      onAddLink(word, url);
      setWord('');  // Clear the input after adding the link
      setUrl('');   // Clear the URL input after adding the link
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Word to Link</label>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Link URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="button"
        onClick={handleAddLink}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Link
      </button>
    </div>
  );
};

export default WordSelection;
