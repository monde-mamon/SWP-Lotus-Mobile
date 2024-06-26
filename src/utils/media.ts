import ImageCropPicker, {
  ImageOrVideo,
} from 'react-native-image-crop-picker';

export const clearCachedImages = (): void => {
  ImageCropPicker.clean()
    .then(() => {})
    .catch(() => {});
};

export const takePictureAsync = async (): Promise<void> => {
  clearCachedImages();
  await ImageCropPicker.openCamera({
    cropping: false,
    includeBase64: true,
    compressImageMaxHeight: 1080,
    compressImageMaxWidth: 1920,
  }).then((result: ImageOrVideo) => {
    // const temp = state.photos.concat(image);
    console.log('camera mo : ', result);
    // setState({...state, photos: temp});
    return result;
  });
};
