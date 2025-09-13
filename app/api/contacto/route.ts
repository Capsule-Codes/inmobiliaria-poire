import { NextRequest, NextResponse } from 'next/server';
import { createContact } from '@/domain/contact';

export async function POST(req: NextRequest) {

    try {

        const inputData = await req.json();

        const newContact = {
            name: inputData.name,
            email: inputData.email,
            phone: inputData.phone,
            message: inputData.message,
            inquiry_type: inputData.inquiry_type,
            property_id: inputData.property_id || null,
            project_id: inputData.project_id || null,
        };

        const contact = await createContact(newContact);

        return NextResponse.json(contact, { status: 201 });

    } catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}
