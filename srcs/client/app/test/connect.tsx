'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Department = {
  id: number | string;
  name: string;
};

function TestConnect() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const getData = async () => {
      const { data } = await supabase.from('departments').select('*');
      if (data) setDepartments(data);
    };
    getData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>接続テスト</h1>
      {departments.length > 0 ? (
        <ul>
          {departments.map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      ) : (
        <p>データが見つからないか、接続されていません...</p>
      )}
    </div>
  );
}

export default TestConnect;
