import {type Context,method,json,fail,adultEnabled} from '../../_lib/core';
export const onRequestGet=async(c:Context)=>{try{method(c,'GET');return json({configured:adultEnabled(c)});}catch(e){return fail(e);}};
