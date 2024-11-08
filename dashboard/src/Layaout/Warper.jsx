import React from 'react';
import { Layout, Card, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

function Warper({ page, pagename }) {
  return (
    <Layout className='w-full' style={{ minHeight: '100vh' }}>
      <Layout.Content className='w-full' style={{ background: '#fff' }}>
        <Card bordered={false}>
          <Title level={2}>{pagename}</Title>
          <div className='w-full'>{page}</div>
        </Card>
      </Layout.Content>
    </Layout>
  );
}

export default Warper;
