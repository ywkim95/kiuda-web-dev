interface DynamicImage {
  [key: string]: string;
}

export interface ModifiedImage extends DynamicImage {
  captureTime: string;
}
