import { useAtom } from 'jotai';
import { delay, isNull } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View, Button, Text } from 'react-native';
import ImageCropPicker, {
  Image,
} from 'react-native-image-crop-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Signature, {
  SignatureViewRef,
} from 'react-native-signature-canvas';
import {
  DeliveryStep3Props,
  SignatureImage,
  initialState,
} from './form';
import { languageAtom, newDeliveryAtom } from '@/src/atom';
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
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const ref = useRef<SignatureViewRef>(null);
  const [lang] = useAtom(languageAtom);

  const [state, setState] = useState<{
    picture_1: Image | null;
    picture_2: Image | null;
    signature: SignatureImage | null;
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

  const uploadPhoto = (
    image: Image | SignatureImage | null,
    isSignature?: boolean
  ): void => {
    if (!image) return;
    const temp = {
      delivery_id: newDelivery?.id,
      image: isSignature
        ? image.data
        : `data:${image.mime};base64,${image.data}`,
    };

    mutate(temp);
  };

  const handleOK = (signature: string): void => {
    setState({
      ...state,
      signature: { data: signature, mime: 'image/jpeg' },
    });
  };

  const handleOnPressSubmit = async (): Promise<void> => {
    if (isNull(state.picture_1) && isNull(state.picture_2)) {
      Alert.alert('Attach at least one image');
      return;
    }
    if (isNull(state.signature)) {
      Alert.alert('Please add your signature');
      return;
    }
    await Promise.all([
      uploadPhoto(state.picture_1),
      uploadPhoto(state.picture_2),
      uploadPhoto(state.signature, true),
    ]).then(() => {
      const delivery = {
        id: newDelivery?.id as number,
        time_out: new Date(),
      };
      updateDeliveryMutate(delivery);
    });
  };

  const onTouchOutSideToLogout = (): void => {
    ref.current?.clearSignature();
    setSuccessVisible(false);
    setSuccessLoading(true);
    onSubmit();
  };

  const handleOnPressClear = (): void => {
    ref.current?.clearSignature();
    setState({
      ...state,
      signature: null,
    });
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <>
          <ScrollView horizontal>
            <PictureButton
              title={lang.picture_1}
              item={state.picture_1 as Image}
              onPress={(): Promise<void> => openCamera('picture_1')}
              onClear={(): void =>
                setState({ ...state, picture_1: null })
              }
              error={''}
            />
            <PictureButton
              title={lang.picture_2}
              item={state.picture_2 as Image}
              onPress={(): Promise<void> => openCamera('picture_2')}
              onClear={(): void =>
                setState({ ...state, picture_2: null })
              }
              error={''}
            />
          </ScrollView>
          <View style={{ height: 300, gap: 10, paddingVertical: 10 }}>
            <Text>{lang.signature}</Text>

            <Signature
              ref={ref}
              onBegin={(): void => setScrollEnabled(false)}
              onEnd={(): void => {
                setScrollEnabled(true);
                ref.current?.readSignature();
              }}
              onOK={handleOK}
              descriptionText=""
              clearText=""
              confirmText=""
              imageType="image/jpeg"
              trimWhitespace
              backgroundColor="rgb(255,255,255)"
            />
            <Button title={lang.clear} onPress={handleOnPressClear} />
          </View>
        </>
      </ScrollView>
      <View style={{ height: hp('10%') }} />

      <PrimaryButton
        onSubmit={handleOnPressSubmit}
        title={lang.done}
      />
    </Container>
  );
};

export default DeliveryStep3;
