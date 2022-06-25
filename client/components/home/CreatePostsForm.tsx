import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { queryBuilder } from "../../utils/queries/queryBuilder";
import MainButton from "../commons/MainButton";

interface PostData {
  imageData: string;
  description: string;
}

const CreatePostsForm = () => {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageValid, setIsImageValid] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [failureText, setFailureText] = useState("");

  const mutation = useMutation(
    (postData: PostData) => queryBuilder("/posts/create", "post", postData)(),
    {
      onSuccess: (data, _v) => {
        if (data.success) {
          queryClient.invalidateQueries("getPosts");
          setImageFile(null);
          setIsImageValid(true);
          setPostContent("");
          setFailureText("");
        } else {
          setFailureText("Posting failed!");
        }
      },
    }
  );

  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.size <= 5e6) {
      setImageFile(file);
      setIsImageValid(true);
    } else {
      setIsImageValid(false);
    }
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageData = reader.result;
      if (typeof imageData === "string") {
        mutation.mutate({ description: postContent, imageData });
      } else {
        setFailureText("Form submission failed!");
      }
    });

    if (!imageFile || !isImageValid) {
      setFailureText("Image is invalid!");
    } else if (postContent.length === 0) {
      setFailureText("Image description is empty!");
    } else {
      reader.readAsDataURL(imageFile);
    }
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
      <div className="text-right">
        <small className="text-red-600">
          {!isImageValid && "Image is too large! Must be <5MB"}
        </small>
      </div>
      <label htmlFor="description" className="sr-only">
        Post Image Description
      </label>
      <textarea
        name="description"
        id="description"
        rows={2}
        placeholder="Write the image description..."
        className="w-full resize-none p-4 shadow rounded mt-2"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        required
        maxLength={300}
      ></textarea>
      <div className="text-right">
        <small
          className={`text-xs ${
            postContent.length === 300
              ? "text-red-600"
              : postContent.length / 300 >= 0.85
              ? "text-orange-400"
              : "text-green-600"
          }`}
        >
          {postContent.length} / 300
        </small>
      </div>
      <p className="text-center text-red-600">{failureText}</p>
      <div className="text-center">
        <MainButton type="submit" className="w-1/2">
          Post
        </MainButton>
      </div>
    </form>
  );
};

export default CreatePostsForm;
