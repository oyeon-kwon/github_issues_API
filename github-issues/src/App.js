import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Data from './data.json';
import noData from './no_data.png';

function App () {
  const [datas, setDatas] = useState([]);
  const [sortDescending, setSortDescending] = useState(true);
  // TODO: sortDescending은 boolean 값이기 때문에 isDescending 과 같이 직관적인 변수명 사용 필요 -> 비교 연산자 없이 값 평가

  if (sortDescending === true) {
    // ! sort 메소드는 Shallow copy 이기 때문에 원본데이터의 값을 바꾼다. 데이터 자체를 가지고 연산을 해 버리면 불필요한 중복 렌더링이 발생
    datas.sort((a, b) => {
      if (a.comments > b.comments) {
        return -1;
      }
      if (a.comments < b.comments) {
        return 1;
      }
      // 0 을 리턴하는 것은 비교대상이 동일함을 의미하기 때문에 없어도 되는 코드
      return 0;
    });
  } else if (sortDescending === false) {
    datas.sort((a, b) => {
      if (a.comments > b.comments) {
        return 1;
      }
      if (a.comments < b.comments) {
        return -1;
      }
      return 0;
    });
  }

  const changeSort = () => {
    setSortDescending(!sortDescending);
  };

  useEffect(() => {
    axios.get('https://api.github.com/repos/facebook/create-react-app/issues')
      .then((data) => {
        const issues = data.data;
        setDatas(issues);
      })
      .catch((err) => {
        // API 제공 한도 초과일 경우, 로컬 json 데이터 활용
        // TODO: err 를 확인해서 해당 err에 맞는 처리 필요
        setDatas(Data);
      });
  }, []);

  return (
    <div className='App'>
      <div className='nav'>Github Issues Tracker</div>
      {
        datas.length === 0
          ? <div className='no-data-body'>
            <img src={noData} className='no-data' />
            <div className='status-desc'>데이터가 없습니다.</div>
          </div>
          : <div className='body'>
            {
          sortDescending === true
            ? <div className='comment-sort-button' onClick={changeSort}>코멘트 수 내림차순</div>
            : <div className='comment-sort-button' onClick={changeSort}>코멘트 수 오름차순</div>
        }
            {
          datas.map((data, id) => {
            return (
              // key 값을 index로 주는 것은 지양
              <div className='issue' key={id}>
                <div className='issue-info'>
                  <div className='number'>issue number  <span className='data'>#{data.number}</span></div>
                  <div className='created_at'>created  <span className='data'>{data.created_at.slice(0, 10)}</span></div>
                  <div className='comments'>comments  <span className='data'>{data.comments}개</span></div>
                </div>
                <div className='title'>{data.title}</div>
              </div>
            );
          })
        }
          </div>
      }

    </div>
  );
}

export default App;
