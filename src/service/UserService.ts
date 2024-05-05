import PROFILE_BACKGROUNDS from "../assets/ProfileBackgrounds";

class UserService {
  private baseUrl: string = "http://192.168.1.101:8080/user";

  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  async uploadProfileImage(imageFile: File): Promise<UserResponse> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const token = this.getAuthToken();

    try {
      const response = await fetch(`${this.baseUrl}/profile/image`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  }

  async getInfoAboutProfile(userId?: number): Promise<UserResponse> {
    const queryParams = userId && userId > 0 ? `?id=${userId}` : "";
    const token = this.getAuthToken();

    try {
      const response = await fetch(`${this.baseUrl}${queryParams}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching profile info:", error);
      throw error;
    }
  }

  createTempImage(width: number, height: number, letter: string): string {
    // Create a canvas element
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Get the drawing context of the canvas
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx === null) {
      throw new Error("Failed to get canvas context");
    }

    // Set background color
    ctx.fillStyle =
      PROFILE_BACKGROUNDS[
        Math.floor(Math.random() * PROFILE_BACKGROUNDS.length)
      ];
    ctx.fillRect(0, 0, width, height);

    // Set text properties
    ctx.fillStyle = "white"; // Text color
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "350px sans-serif"; // Adjust font size as needed

    // Draw the letter on the canvas
    ctx.fillText(letter, width / 2, height / 2);

    // Convert the canvas to an image (DataURL)
    const dataUrl: string = canvas.toDataURL();

    return dataUrl;
  }
}

export default UserService;
