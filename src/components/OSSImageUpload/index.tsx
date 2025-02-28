import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { useQuery } from '@apollo/client';
import { GET_OSS_INFO } from '@/graphql/oss';
import ImgCrop from 'antd-img-crop';

interface OSSDataType {
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
}

interface OSSUploadProps {
  value?: UploadFile[];
  label?: string
  maxCount?: number
  imgCropAspect?: number
  storePath?: string
  onChange?: (files?: UploadFile[]) => void;
}

const OSSImageUpload = ({
  imgCropAspect = 1 / 1,
  label = '更換圖像',
  maxCount = 1,
  value,
  storePath = '',
  onChange,
}: OSSUploadProps) => {
  const { data, refetch } = useQuery<{ getOSSInfo: OSSDataType }>(GET_OSS_INFO)

  const OSSData = data?.getOSSInfo
  const getKey = (file: UploadFile) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const key = `${OSSData?.dir}${storePath}/${file.uid}${suffix}`;
    const url = `${OSSData?.host}/${key}`;
    return { key, url };
  };

  /**
  1.再執行完getExtraData()將檔案上傳至阿里雲後，最後會執行handleChange()這裡的程序邏輯。
  2.透過onChange()可以將檔案資料送到上層的<ProForm/>組件，讓<ProForm/>裡onFinish功能可以收到資料
  3.這裡的handleChange設計成將支援多個檔案類型
  */
  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const files = fileList.map((file) => {
      return {
        ...file,
        url: file.url || getKey(file).url,
      }
    });
    onChange?.(files);
  };

  /**
   1.這裡的getExtraData是在beforeUpload()執行完後開始
   2.在這裡是添加上傳到阿里雲的相關設定，並將檔案上傳至阿里雲
  */
  const getExtraData: UploadProps['data'] = (file) => {
    return {
      /**
        1.這裡所設置的key屬性是上傳到阿里雲的資料夾位置/檔名，例如images/abc.jpg
        2.如果沒有設置資料夾位置，預設上傳到根目錄的位置，預設位置在action={OSSData?.host}
      */
      // key: key.current,
      key: getKey(file).key,
      OSSAccessKeyId: OSSData?.accessId,
      policy: OSSData?.policy,
      Signature: OSSData?.signature
    }
  }


  //這裡是最先執行的，檔案在上傳之前會先比對一下傳後端傳過來的OSS相關資訊的過期時間
  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) return false;
    const expire = Number(OSSData?.expire) * 1000;

    if (expire < Date.now()) {
      await refetch();
    }
    return file;
  };

  return (
    <ImgCrop rotationSlider aspect={imgCropAspect}>
      <Upload
        name='file'
        maxCount={maxCount}
        listType="picture-card"
        fileList={Array.isArray(value) ? value : value ? [value] : []}
        action={OSSData?.host}
        onChange={handleChange}
        data={getExtraData}
        beforeUpload={beforeUpload}
      >
        {label}
      </Upload>
    </ImgCrop>
  );
};


export default OSSImageUpload 