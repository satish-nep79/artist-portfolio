export interface ProgramModel {
    id: string;
    tag: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    startTime: Date;
    endTime: Date;
    location: string;
    description: string;
    imageUrl: string;
    link?: string;
    buttonText: string;
}