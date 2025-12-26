import React from 'react';

const DynamicTable = ({ data, headers }: any) => {
    return (
        <div id='Dropdowntable'>
            <table >
                <thead>
                    <tr >
                        {headers.map((header: any, index: any) => (
                            <th key={index} colSpan={10} scope="col">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: any, rowIndex: any) => (
                        <tr key={rowIndex}>
                            {headers.map((header: any, colIndex: any) => (
                                <td key={colIndex} colSpan={15} className="px-2 py-1" data-label={header}>
                                    {item[header.toLowerCase()]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table >
        </div>


    );
};

export default DynamicTable;
