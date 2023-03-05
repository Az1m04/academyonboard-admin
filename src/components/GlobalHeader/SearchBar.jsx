import React, { useEffect } from 'react';

import { Form, Input } from 'antd';
import { debounce } from 'lodash';

function SearchBar({ setKeyword, location, placeholder, size, bordered, suffix }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (location?.query?.keyword) {
      setKeyword(location?.query?.keyword);
      form.setFieldsValue({
        keyword: location?.query?.keyword,
      });
    }
    return () => {};
  }, [location?.query?.keyword]);

  const action = (value) => {
    setKeyword(value);
    // setQueryStringWithoutPageReload(`?keyword=${value}`);
  };

  const debounceSearch = React.useCallback(debounce(action, 400), []);

  return (
    <Form form={form} className="w-full">
      <div className="inline-flex items-center flex-auto space-x-2 w-full ">
        <Form.Item noStyle className="w-full" name="keyword">
          <Input
            type="text"
            onChange={(e) => {
              debounceSearch(e.target.value);
            }}
            className="w-full"
            size={size}
            placeholder={placeholder}
            bordered={bordered}
            suffix={suffix}
          />
        </Form.Item>
      </div>
    </Form>
  );
}

export default SearchBar;
