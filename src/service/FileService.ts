class FileService {
  dataURLtoFile(dataUrl: string, filename: string) {
    // Split the data URL into parts to separate the MIME type and the base64 encoded data
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch) {
      throw new Error("Could not parse MIME type from data URL");
    }
    const mime = mimeMatch[1];
    // Decode the base64 string to binary data
    const bstr = atob(arr[1]);

    // Create an array buffer and a view (as a typed array) to create the binary large object
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Convert the ArrayBuffer to a Blob
    const blob = new Blob([u8arr], { type: mime });

    // Create and return a new File object
    return new File([blob], filename, { type: mime });
  }
}

export default new FileService();
