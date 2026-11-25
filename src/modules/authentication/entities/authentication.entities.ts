export interface ILoginResponse {
    accessToken: string,
    refereshToken: string
}
export interface ISignupWithGmailResponse {
    status: number,
    data: ILoginResponse
}