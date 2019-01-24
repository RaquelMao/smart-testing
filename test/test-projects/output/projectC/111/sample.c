/*
1
测试是否正确产生分支及mcdc用例
正确值：2个分支、3个mcdc
*/
int branch(int a, int b){
  if(a==2 || b==3){
    return 0;
  }
  return 1;
}

/*
2
测试浮点类型是否正确产生分支及mcdc用例
正确值：2个分支、3个mcdc
*/
double branch_float(float a, double b){
  if(a==2.0||b==3.0){
    return 1.0;
  }
  return 2.0;
}

/*
3
测试用例是否被正确化简
正确值：用例大小小于1M
*/
int array[100000];
int largeCase(){
  if(array[500]==3126){
     return 0;
  }
  return 1;
}



/*
5
测试mcdc用例去重
正确值：mcdc产生4个用例，覆盖率100%
*/
int mcdc_reduce(int b, int c, int d){
  int a=1000;
  while(a>0){
    if(b>1&&c>1&&d>1){
      int c=10;
    }
    a--;
  }
  return 0;
}

/*
6
测试指针crash情况
正确值：产生一个用例，crash一个用例
*/
int crash (int *a){
  *a = 2;
  return 0;
}

/*
7
测试VOID类型情况
正确值：产生2个测试用例
*/
typedef void VOID;
VOID void_test(int a){
	if(a==1){
		a=2;
	}
	else{
		a=3;
	}
}
