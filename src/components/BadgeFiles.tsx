/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BadgeFilesProps {
  listFiles: any[] 
  version?: 'NEW' | 'OLD' 
}

const BadgeFiles = ({
  listFiles,
  version = 'NEW',
}:BadgeFilesProps) => {
  
  const qtdFiles = listFiles ? listFiles.length : 0

  const styleVersion = setStyleVersion()
  function setStyleVersion () {        
    if (version === 'OLD') {
      return 'badge-files-old'
    }else{
      return ''
    }
  }

  return (       
    <span className={['badge-files',styleVersion,].join(' ')} >
      {qtdFiles}
    </span>    
  );
};

export default BadgeFiles;
