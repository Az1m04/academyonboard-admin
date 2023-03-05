import React from 'react';
import style from './index.less';

export default function StepLabel({
  data,
  red,
  green,
  onClick,
  labelNo,
  lastRed,
  last,
  firstGreen,
  first,
}) {
  return (
    <div
      className={`${style.con} ${green ? 'cursor-pointer' : 'cursor-auto'} `}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <div
        className={`${style.arrow1} ${
          red ? style.arrow1Red : green ? style.greenArrow1 : style.primaryColorArrow1
        }   ${first && style.firstPrimary} ${firstGreen && style.firstGreen}`}
      />
      <div
        className={`${style.arrow} text-white text-base ${
          red ? style.arrowRed : green ? style.greenArrow : style.primaryColorArrow
        }  truncate ...`}
      >
        {data?.length > 9 ? `${data?.slice(0, 9)}...` : data}{' '}
        {labelNo && (
          <div style={{ position: 'absolute' }}>
            <div
              style={{ position: 'absolute', top: '-35px', right: '-32px' }}
              className={` ${style.dot} rounded-full border text-base shadow-md bg-white h-6  text-black w-6  flex items-center justify-center`}
            >
              {labelNo}
            </div>
          </div>
        )}
      </div>
      <div
        className={`${style.arrow2} ${last && style.lastArrow2}  ${
          red ? style.arrow2Red : green ? style.greenArrow2 : style.primaryColorArrow2
        }   ${last && style.lastPrimary} ${lastRed && style.lastRed} `}
      />
    </div>
  );
}
