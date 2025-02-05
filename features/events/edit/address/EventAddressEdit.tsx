"use client";

import InputField from "@/components/molecules/InputField/InputField";
import InputLabel from "@mui/material/InputLabel";
import SelectBox from "@/components/molecules/SelectBox/SelectBox";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";
import {
  prefectures,
  villages,
  mapformats,
  mailformats,
  TPrefectureEnum,
} from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/molecules/Loading/loading";
import EditBackBtn from "@/components/atoms/EditBackBtn";
import RequiredLabel from "@/components/atoms/RequiredLabel";
import "./EventAddressEdit.css";

interface IFormProps {
  prefecture: string;
  address1: string;
  address2: string;
  webaddress: string;
  mapaddress: string;
}

const CampaignAddressEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVillages, setSelectedVillages] = useState<string[]>(
    villages[prefectures[0] as TPrefectureEnum]
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormProps>({
    defaultValues: {
      prefecture: prefectures[0],
      address1: villages[prefectures[0] as TPrefectureEnum][0],
      address2: "",
      webaddress:
        prefectures[0] + villages[prefectures[0] as TPrefectureEnum][0],
      mapaddress:
        prefectures[0] + villages[prefectures[0] as TPrefectureEnum][0],
    },
  });

  useEffect(() => {
    const fetchEventAddress = async () => {
      setIsLoading(true);
      const res = await axios.post("/api/events/detail", { id });
      const data = res.data[0];
      if (res.status === 200) {
        if (data.prefecture) {
          setValue("prefecture", data.prefecture);
          const currentVillages = villages[data.prefecture as TPrefectureEnum];
          setSelectedVillages(currentVillages);
          setValue(
            "address1",
            data.address1 || villages[data.prefecture as TPrefectureEnum][0]
          );
          setValue("address2", data.address2 || "");
          setValue(
            "webaddress",
            data.prefecture +
              (data.address1 ||
                villages[data.prefecture as TPrefectureEnum][0]) +
              (data.address2 || "")
          );
          setValue(
            "mapaddress",
            data.prefecture +
              (data.address1 ||
                villages[data.prefecture as TPrefectureEnum][0]) +
              (data.address2 || "")
          );
        }
      }
      setIsLoading(false);
    };
    fetchEventAddress();
  }, []);

  const currentPrefecture = watch("prefecture") || prefectures[0];
  const currentAddress1 =
    watch("address1") || villages[currentPrefecture as TPrefectureEnum][0];
  const currentAddress2 = watch("address2") || "";
  const fullAddress = currentPrefecture + currentAddress1 + currentAddress2;

  useEffect(() => {
    const currentVillages = villages[currentPrefecture as TPrefectureEnum];
    setValue("prefecture", currentPrefecture);
    setValue("address1", currentVillages[0]);
    setSelectedVillages(currentVillages);
  }, [currentPrefecture]);

  useEffect(() => {
    setValue("address1", currentAddress1);
  }, [currentAddress1]);

  useEffect(() => {
    setValue("webaddress", fullAddress);
    setValue("mapaddress", fullAddress);
  }, [fullAddress]);

  const onSubmit = async (data: IFormProps) => {
    const { prefecture, address1, address2 } = data;
    await axios.post("/api/events/update", {
      id,
      field_name: "prefecture",
      field_value: prefecture,
    });

    await axios.post("/api/events/update", {
      id,
      field_name: "address1",
      field_value: address1,
    });

    await axios.post("/api/events/update", {
      id,
      field_name: "address2",
      field_value: address2,
    });

    router.push(`/events/${id}`);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="px-10 py-8 w-full">
        <h1 className="border-hover-green border-l-[6px] text-[20px] p-0 pl-2 mb-5 font-bold text-[#555]">
          都道府県 の編集
        </h1>
        <div className="flex flex-col bg-white items-start mt-5 p-5 w-full">
          {/* Address Prefecture */}
          <div className="flex w-full items-center">
            <div className="flex w-[250px] justify-end pr-5">
              <InputLabel htmlFor="prefecture">都道府県</InputLabel>
              <RequiredLabel />
            </div>
            <div className="flex flex-col w-full">
              <SelectBox
                id="prefecture"
                control={control}
                value={currentPrefecture}
                names={prefectures}
                className="max-w-[250px]"
              />
            </div>
          </div>

          {/* Address Address1 */}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] justify-end pr-5">
              <InputLabel htmlFor="address1">市区町村</InputLabel>
            </div>
            <div className="flex flex-col w-full">
              <SelectBox
                id="address1"
                control={control}
                value={currentAddress1}
                names={selectedVillages}
                className="max-w-[250px]"
              />
            </div>
          </div>

          {/* Address Address2 */}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] justify-end pr-5">
              <InputLabel htmlFor="address2">以降住所</InputLabel>
            </div>
            <div className="flex flex-col w-full">
              <InputField
                id="address2"
                control={control}
                placeholder="「〇〇町」までご入力ください（英数字・記号入力不可）"
                value={currentAddress2}
              />
            </div>
          </div>

          {/* After Address */}
          <div className="flex w-full items-center mt-5 pb-5 bg-[#eee]">
            <div className="flex w-[250px] justify-end pr-5">
              <InputLabel htmlFor="afteraddress">非表示箇所</InputLabel>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-[14px] mt-3 mb-1">
                ここより下は地図表示の為にご入力いただきます。
              </p>
              <InputField
                id="afteraddress"
                control={control}
                className="bg-white"
                placeholder="「3-16-5」など番地をご入力ください"
              />
              <p className="text-[14px] mt-3">
                ※プライバシー保護の為WEB上に表示しない部分はこちらに入力ください。
              </p>
            </div>
          </div>

          {/* Web Address */}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] justify-end pr-5">
              <InputLabel htmlFor="webaddress">
                WEB上に表示される住所
              </InputLabel>
            </div>
            <div className="flex flex-col w-full">
              <InputField
                id="webaddress"
                disabled
                control={control}
                placeholder="「〇〇町」までご入力ください（英数字・記号入力不可）"
                value={fullAddress}
              />
            </div>
          </div>

          {/* Map Address */}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] justify-end pr-5">
              <InputLabel htmlFor="mapaddress">地図で利用される住所</InputLabel>
              <RequiredLabel />
            </div>
            <div className="flex flex-col w-full">
              <InputField
                id="mapaddress"
                disabled
                control={control}
                value={fullAddress}
              />
            </div>
          </div>

          {/* Map Address Format */}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] self-start justify-end pr-5">
              <InputLabel htmlFor="mapformat">地図表示形式</InputLabel>
              <RequiredLabel />
            </div>
            <div className="flex flex-col w-full">
              <SelectBox
                id="mapformat"
                control={control}
                // value={""}
                names={mapformats}
                className="max-w-[250px]"
              />
              <p className="text-[14px] mt-3">
                ※ 地図の表示形式を選択してください。<br></br>
                ※「地図を非表示にする」に変更した場合、予約確定メールからのみ地図が表示されます。
              </p>
            </div>
          </div>

          {/* Mail Address Format */}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] self-start justify-end pr-5">
              <InputLabel htmlFor="mailformat">メール住所表示形式</InputLabel>
              <RequiredLabel />
            </div>
            <div className="flex flex-col w-full">
              <SelectBox
                id="mailformat"
                control={control}
                // value={""}
                names={mailformats}
                className="max-w-[400px]"
              />
            </div>
          </div>

          {/* Register*/}
          <div className="flex w-full items-center mt-5">
            <div className="flex w-[250px] self-start justify-end pr-5"></div>
            <div className="flex flex-col w-full">
              <Button type="submit" className="update_btn" variant="contained">
                更新する
              </Button>
            </div>
          </div>
        </div>
        <EditBackBtn className="mt-4" linkUrl={`/events/${id}`} />
      </div>
    </form>
  );
};

export default CampaignAddressEditPage;
