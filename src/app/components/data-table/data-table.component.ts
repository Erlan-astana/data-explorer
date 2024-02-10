import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from 'src/app/models/user-data.model';
import { ApiService } from 'src/app/services/api-service';
import { first } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @ViewChildren(MatSelect) matSelects!: QueryList<MatSelect>;

  dataSource!: MatTableDataSource<UserData>;
  searchValue = '';
  pageNumber = 1;
  pageSize = 5;
  totalItems = 5;
  filter: { column: string, value: string }[] = [];
  displayedColumns = ['isActive', 'balance', 'picture', 'age', 'name', 'company', 'email', 'address', 'tags', 'favoriteFruit'];
  selectedColumns: string[] = this.displayedColumns.slice();
  filterColumns = ['isActive', 'balance', 'age', 'favoriteFruit'];
  translatedColumns: { [key: string]: string } = {
    'isActive': 'Активен',
    'balance': 'Баланс',
    'picture': 'Фотография',
    'age': 'Возраст',
    'name': 'Имя',
    'company': 'Компания',
    'email': 'Эл. почта',
    'address': 'Адрес',
    'tags': 'Теги',
    'favoriteFruit': 'Любимый фрукт'
  };

  dataFilter: any = {
    'isActive': [{ name: 'активный', value: true }, { name: 'не активный', value: false }],
    'balance': [{ name: '> 1000', value: 1000 }, { name: '> 3000', value: 3000 }],
    'age': [{ name: '> 18', value: 18 }, { name: '> 30', value: 30 }],
    'favoriteFruit': [{ name: 'apple', value: 'apple' }, { name: 'banana', value: 'banana' }, { name: 'strawberry', value: 'strawberry' }]
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadData();
  }

  search(): void {
    this.loadData();
  }

  handlePage(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  applyFilter(columnName: string, filterValue: any): void {
    const existingFilterIndex = this.filter.findIndex(existing => existing.column === columnName);
    if (existingFilterIndex !== -1) {
      this.filter[existingFilterIndex].value = filterValue;
    } else {
      this.filter.push({ column: columnName, value: filterValue });
    }
    this.loadData();
  }

  loadData(): void {
    this.apiService.fetchData(this.searchValue, this.filter, this.pageNumber, this.pageSize)
      .pipe(first()).subscribe((response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.totalItems = response.totalItems;
      })
  }

  isActive(columnName: string): boolean {
    return columnName === 'isActive';
  }

  isPicture(columnName: string): boolean {
    return columnName === 'picture';
  }

  isColumn(columnName: string): boolean {
    return !(columnName === 'picture' || columnName === 'isActive');
  }

  toggleColumn(column: string): void {
    const index = this.selectedColumns.indexOf(column);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(column);
    }
  }

  reset(): void {
    this.searchValue = '';
    this.matSelects.forEach(select => {
      select.value = null;
    });
    this.filter = [];
    this.loadData();
  }

  renderCell(cellData: any): string {
    if (Array.isArray(cellData)) {
      return cellData.join(', ');
    } else if (cellData && typeof cellData === 'object') {
      return cellData.first + ' ' + cellData.last;
    } else if (typeof cellData === 'string' || typeof cellData === 'number' || typeof cellData === 'boolean') {
      return cellData.toString();
    } else {
      return '';
    }
  }
}
