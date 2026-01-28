import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();

  const data = {
    title: formData.get('title'),
    category_id: formData.get('category_id'),
    start_datetime: formData.get('start_datetime'),
    end_datetime: formData.get('end_datetime'),
    location_name: formData.get('location_name'),
    description: formData.get('description'),
    is_published: formData.get('is_published') === 'true',
  };

  console.log('EVENT:', data);

  return NextResponse.json({ success: true });
}
