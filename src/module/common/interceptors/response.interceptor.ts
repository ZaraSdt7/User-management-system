import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor 
{
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> | Promise<Observable<unknown>> {
        return next.handle().pipe(
            map(data => {
                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    data: data,
                    status:'success',
                    message: 'Request was successful'
                };
            })
        );
    }
}