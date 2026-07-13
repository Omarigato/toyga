import { Controller, Get, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard, AdminGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearerAuth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  async getStats() {
    return this.adminService.getStats();
  }

  // ─── Users Management ────────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: 'List all users with search and pagination' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.findAllUsers(page, limit, search);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update user role (admin only)' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.updateUserRole(id, body.role, adminId);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user status (suspend/activate)' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.updateUserStatus(id, body.status, adminId);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Soft delete a user' })
  async deleteUser(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.adminService.deleteUser(id, adminId);
  }

  // ─── Events Management ───────────────────────────────────────────────
  @Get('events')
  @ApiOperation({ summary: 'List all events (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllEvents(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.findAllEvents(page, limit);
  }

  // ─── Templates Management ────────────────────────────────────────────
  @Get('templates')
  @ApiOperation({ summary: 'List all templates (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllTemplates(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.findAllTemplates(page, limit);
  }

  // ─── Media Management ────────────────────────────────────────────────
  @Get('media')
  @ApiOperation({ summary: 'List all media (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllMedia(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.findAllMedia(page, limit);
  }

  // ─── Categories Management ───────────────────────────────────────────
  @Get('categories')
  @ApiOperation({ summary: 'List all categories with template counts (admin)' })
  async findAllCategories() {
    return this.adminService.findAllCategories();
  }
}
