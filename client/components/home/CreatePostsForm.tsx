import { ChangeEventHandler, FormEventHandler, useState } from "react";
import MainButton from "../commons/MainButton";

const CreatePostsForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file);
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // dispatch useMutate here!
  };

  return (
    <form onSubmit={handleFormSubmit} className="pt-8 pb-6">
      <label
        htmlFor="imageUpload"
        className="w-full flex items-center shadow rounded cursor-pointer"
      >
        <span className="basis-4/5 text-center py-3 bg-slate-200">
          {imageFile?.name || "Choose image..."}
        </span>
        <span className="basis-1/5 text-center py-3 bg-slate-400">Browse</span>
        <input
          type="file"
          name="imageUpload"
          id="imageUpload"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
          required
        />
      </label>
      <label htmlFor="description" className="sr-only">
        Post Image Description
      </label>
      <textarea
        name="description"
        id="description"
        rows={2}
        placeholder="Write the image description..."
        className="w-full resize-none p-4 shadow rounded my-2"
        required
      ></textarea>
      <div className="text-center">
        <MainButton type="submit" className="w-1/2">
          Post
        </MainButton>
      </div>
    </form>
  );
};

export default CreatePostsForm;
