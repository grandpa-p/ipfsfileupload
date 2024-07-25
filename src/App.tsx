import { useState, ReactElement } from 'react';
import './App.css';
import { uploadMultipleToIPFS, uploadToIPFS } from './Infura';

type FileResult = {
  filename: string;
  url: string;
};

function App(): ReactElement {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [results, setResults] = useState<FileResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setResults([]);

    try {
      if (files.length === 1) {
        const url = await uploadToIPFS(files[0]);
        setResults([{ filename: files[0].name, url }]);
      } else if (files.length > 1) {
        const filesToUpload = files.map((file: File) => ({
          name: file.name,
          content: file
        }));
        const uploadedFiles = await uploadMultipleToIPFS(filesToUpload);
        setResults(uploadedFiles);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Choose file(s)
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
          <button
            type="submit"
            disabled={files.length === 0 || uploading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {uploading ? 'Uploading...' : 'Upload to IPFS'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Upload Results:</h3>
            <ul className="mt-2 divide-y divide-gray-200">
              {results.map((result: FileResult, index: number) => (
                <li key={index} className="py-2">
                  <p className="text-sm font-medium text-gray-900">{result.filename}</p>
                  <a href={result.url} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {result.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default App;
