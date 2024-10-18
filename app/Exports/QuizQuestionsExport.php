<?php

namespace App\Exports;

use App\Models\QuizQuestion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class QuizQuestionsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return QuizQuestion::all(); 
    }

    public function headings(): array
    {
        return [
            'ID',         
            'Quiz ID',
            'Question',
            'Created At',
            'Updated At',
        ];
    }
}
