import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import StatusField from "@/components/molecules/StatusField/StatusField";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { getReservationPeriod, eventDateTimeSplit } from "@/utils/convert";
import { IEventDateTime } from "@/lib/recoil/EventDateAtom";
import { formatISO8601TimestampToJapaneseString } from "@/utils/convert";
import "./EventListItem.css";

export interface IEventListItem {
  id: number;
  title: string;
  type: string;
  format: string;
  attend: number;
  eventDate: string;
  status: string;
  priority: number;
  prefecture: string;
  address1: string;
  address2: string;
  imgUrl: string;
  mainImg: number;
  updatedAt: string;
}

const EventListItem: React.FC<{ values: IEventListItem }> = ({ values }) => {
  const {
    id,
    title,
    type,
    format,
    attend,
    eventDate,
    status,
    priority,
    prefecture,
    address1,
    address2,
    imgUrl,
    mainImg,
    updatedAt,
  } = values;

  const displayImg = imgUrl
    ? imgUrl.split(",").map((img) => img.trim())[mainImg]
    : "";

  const address = (prefecture || "") + (address1 || "") + (address2 || "");

  let eventDates: IEventDateTime[] = [];
  if (eventDate) {
    const saveDates = eventDate.split(",").map((date) => date.trim());
    eventDates = saveDates.map((saveDate) => eventDateTimeSplit(saveDate));
  }

  return (
    <div className="w-full flex border-[1px] border-[#ddd] mb-5">
      <div className="flex flex-col justify-center items-center w-[120px] border-r-[1px] border-[#ddd] p-1">
        {priority === 1 && <StarsRoundedIcon className="star_icon" />}
        <StatusField status={status} />
      </div>
      <div className="flex p-5">
        <Image
          src={imgUrl ? displayImg : "/imgs/events/no_image.png"}
          width={160}
          height={120}
          className="w-[160px] h-[120px]"
          alt="イベント画像"
        />
        <div className="ml-10">
          <span className="text-[10px] text-white bg-black px-2 py-[2px]">
            {type}
          </span>
          <span className="text-xs border-[1px] border-[#737373] px-2 py-[2px] ml-1">
            {format}
          </span>
          <span className="text-sm ml-2">
            予約者 :{" "}
            <Link href="#" className="text-[#ea9b54]">
              {attend} 名
            </Link>
          </span>
          <div className="text-sm mt-3 mb-5">{title}</div>
          {eventDates.length > 0 && (
            <div className="text-sm text-[#ff0000]">
              {getReservationPeriod(eventDates)}
            </div>
          )}
          {address && <div className="text-sm my-1">・{address}</div>}
          <span className="text-xs mt-2 bg-[#2FA8B5] px-2 py-[2px] text-white">
            iemiru掲載設定済み
          </span>
        </div>
      </div>
      <div className="flex flex-col ml-auto p-5 w-[25%]">
        <Button href={`/events/${id}`} className="edit_btn" variant="contained">
          <EditRoundedIcon className="mr-1" />
          イベントを編集
        </Button>
        <div className="flex justify-between text-sm">
          <Link
            className="border-[1px] w-[49%] border-[#484848] text-center p-[1px]"
            href={`/events/${id}/preview`}
          >
            プレビュー
          </Link>
          <Link
            className="border-[1px] w-[49%] border-[#484848] text-center p-[1px]"
            href={"#"}
          >
            複製
          </Link>
        </div>
        <div className="text-[11px] mt-auto">最終更新: {formatISO8601TimestampToJapaneseString(updatedAt)}</div>
      </div>
    </div>
  );
};

export default EventListItem;
