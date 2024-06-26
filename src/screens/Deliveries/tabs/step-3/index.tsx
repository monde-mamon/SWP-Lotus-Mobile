import { useAtom } from 'jotai';
import { delay, isNull } from 'lodash';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import ImageCropPicker, {
  Image,
} from 'react-native-image-crop-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DeliveryStep3Props, initialState } from './form';
import { newDeliveryAtom } from '@/src/atom';
import { Container } from '@/src/components/container';
import CustomModal from '@/src/components/CustomModal';
import { PictureButton } from '@/src/components/picture-button';
import { PrimaryButton } from '@/src/components/primary-button';
import { updateDeliveryAtom } from '@/src/queries';
import { uploadPhotoAtom } from '@/src/queries/photo';

const DeliveryStep3 = ({
  onSubmit,
  isReset,
}: DeliveryStep3Props): JSX.Element => {
  const [newDelivery] = useAtom(newDeliveryAtom);
  const [{ data, isError, mutate }] = useAtom(uploadPhotoAtom);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successLoading, setSuccessLoading] = useState(true);

  const [state, setState] = useState<{
    picture_1: Image | null;
    picture_2: Image | null;
  }>(initialState);

  const [
    {
      data: updateDeliveryData,
      isError: updateDeliveryIsError,
      mutate: updateDeliveryMutate,
    },
  ] = useAtom(updateDeliveryAtom);

  const openCamera = async (
    type: 'picture_1' | 'picture_2'
  ): Promise<void> => {
    ImageCropPicker.openCamera({
      cropping: false,
      includeBase64: true,
      compressImageMaxHeight: 1080,
      compressImageMaxWidth: 1920,
    }).then((result: Image) => {
      setState({ ...state, [type]: result });
    });
  };

  const uploadPhoto = (image: Image | null): void => {
    if (!image) return;
    const temp = {
      delivery_id: newDelivery?.id,
      image: `data:${image.mime};base64,${image.data}`,
    };

    mutate(temp);
  };

  const handleOnPressSubmit = async (): Promise<void> => {
    if (isNull(state.picture_1) && isNull(state.picture_2)) {
      Alert.alert('Attach at least one image');
      return;
    }
    await Promise.all([
      uploadPhoto(state.picture_1),
      uploadPhoto(state.picture_2),
    ]).then(() => {
      const delivery = {
        id: newDelivery?.id as number,
        time_out: new Date(),
      };
      updateDeliveryMutate(delivery);
    });
  };

  const onTouchOutSideToLogout = (): void => {
    setSuccessVisible(false);
    setSuccessLoading(true);
    onSubmit();
  };

  useEffect(() => {
    if (
      data &&
      !isError &&
      updateDeliveryData &&
      !updateDeliveryIsError
    ) {
      setSuccessVisible(true);
      delay(() => setSuccessLoading(false), 1500);
    }
  }, [data, isError, updateDeliveryData, updateDeliveryIsError]);

  useEffect(() => {
    if (isReset) {
      setState(initialState);
    }
  }, [isReset]);

  return (
    <Container style={{ flex: 1, paddingHorizontal: 15 }}>
      <CustomModal
        visible={successVisible}
        loading={successLoading}
        onTouchOutside={onTouchOutSideToLogout}
        text="Delivery Item Uploaded!"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <PictureButton
            title="Picture 1"
            item={state.picture_1 as Image}
            onPress={(): Promise<void> => openCamera('picture_1')}
            error={''}
          />
          <PictureButton
            title="Picture 2"
            item={state.picture_2 as Image}
            onPress={(): Promise<void> => openCamera('picture_2')}
            error={''}
          />
        </>
      </ScrollView>
      <View style={{ height: hp('10%') }} />

      <PrimaryButton onSubmit={handleOnPressSubmit} title="Done" />
    </Container>
  );
};

export default DeliveryStep3;
