interface ISleepProps{
    ms:number;
    sg?:number;
}

export const sleep = async (props: ISleepProps) => {
    const {ms} = props;
    const convert = props?.sg?props.sg*1000:ms;
    await new Promise(resolve => setTimeout(resolve,convert));
}

