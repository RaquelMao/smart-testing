/*
1
�����Ƿ���ȷ������֧��mcdc����
��ȷֵ��2����֧��3��mcdc
*/
int branch(int a, int b){
  if(a==2 || b==3){
    return 0;
  }
  return 1;
}

/*
2
���Ը��������Ƿ���ȷ������֧��mcdc����
��ȷֵ��2����֧��3��mcdc
*/
double branch_float(float a, double b){
  if(a==2.0||b==3.0){
    return 1.0;
  }
  return 2.0;
}

/*
3
���������Ƿ���ȷ����
��ȷֵ��������СС��1M
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
����mcdc����ȥ��
��ȷֵ��mcdc����4��������������100%
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
����ָ��crash���
��ȷֵ������һ��������crashһ������
*/
int crash (int *a){
  *a = 2;
  return 0;
}

/*
7
����VOID�������
��ȷֵ������2����������
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
