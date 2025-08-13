import { useState } from "react";

// Utility function to handle tag selection and filtering
export const useTagSelection = (control, setValue, tagList, formField) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (selectedTagId, index) => {
    // Update selectedTags state
    setSelectedTags((prevSelectedTags) => {
      const updatedTags = [...prevSelectedTags];
      updatedTags[index] = selectedTagId;
      return updatedTags.filter(Boolean); // Remove undefined/null values
    });

    // Update the form value
    setValue(`${formField}.${index}.tag_id`, selectedTagId);
  };

  const getFilteredOptions = (index) => {
    // Filter options to exclude already selected tags
    return tagList.filter(tag => !selectedTags.includes(tag.id) || tag.id === selectedTags[index]);
  };

  return { handleTagChange, getFilteredOptions, selectedTags };
};
