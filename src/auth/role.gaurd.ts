import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { RoleException } from 'src/common/error/error.customExceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    //store_code_arr 로사용하면될듯
    const { user, query} = context.switchToHttp().getRequest();
    // console.log("store_code_arr ::: ",user.store_code_arr)
    // console.log("query ::: ", query)

    const checkAuthStoreCodeTF = user.store_code_arr.some(item => item.store_code === query.store_code);

    if(user.role_type == 'client' && !checkAuthStoreCodeTF ){//store 권한체크
      throw new RoleException()
    }

    //return requiredRoles == user.role;
    if(requiredRoles.some((role) => user.role_type.includes(role))){
      return true
    }else{
      throw new RoleException()
    }
  }
}