import * as React from "react";
import FileUpload from "@cloudscape-design/components/file-upload";
import FormField from "@cloudscape-design/components/form-field";

interface FileUploadProps {
    onUpload: (data:File[])=> void;
}

export default ({onUpload}:FileUploadProps) => {
  const [value, setValue] = React.useState<File[]>([]);
  return (
    <FormField
      label="Upload Test Data"
      description="Please ensure formatting guidelines are followed for correct results."
    >
      <FileUpload
        onChange={({ detail }) => {onUpload(detail.value)}}
        value={value}
        i18nStrings={{
          uploadButtonText: e =>
            e ? "Choose files" : "Choose file",
          dropzoneText: e =>
            e
              ? "Drop files to upload"
              : "Drop file to upload",
          removeFileAriaLabel: e =>
            `Remove file ${e + 1}`,
          limitShowFewer: "Show fewer files",
          limitShowMore: "Show more files",
          errorIconAriaLabel: "Error"
        }}
        multiple
        showFileLastModified
        showFileSize
        // showFileThumbnail
        tokenLimit={3}
      />
    </FormField>
  );
}